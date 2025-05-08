import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, ImageIcon, Video, MoreHorizontal, Pencil, Trash, Eye, Download } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminMedia() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Gallery</h1>
          <p className="text-muted-foreground">Manage all tournament media content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/media/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Media
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>Media Gallery</CardTitle>
              <CardDescription>View and manage all tournament media</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search media..." className="pl-8 w-[200px] md:w-[300px]" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Media</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="relative group overflow-hidden rounded-lg">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      width={300}
                      height={200}
                      alt={`Media item ${item}`}
                      className="object-cover w-full aspect-video"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-3 transition-opacity bg-black/60 opacity-0 group-hover:opacity-100">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-white">
                        <div className="flex items-center gap-2">
                          {item % 3 === 0 ? (
                            <Badge className="bg-blue-500 hover:bg-blue-600">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <ImageIcon className="w-3 h-3 mr-1" />
                              Image
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-1 text-sm font-medium">
                          {item % 3 === 0 ? "Match Highlights" : "Tournament Photo"}
                        </h3>
                        <p className="text-xs text-white/70">June {item + 1}, 2023</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="images" className="mt-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 4, 5, 7, 8].map((item) => (
                  <div key={item} className="relative group overflow-hidden rounded-lg">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      width={300}
                      height={200}
                      alt={`Image ${item}`}
                      className="object-cover w-full aspect-video"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-3 transition-opacity bg-black/60 opacity-0 group-hover:opacity-100">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-white">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Image
                          </Badge>
                        </div>
                        <h3 className="mt-1 text-sm font-medium">Tournament Photo</h3>
                        <p className="text-xs text-white/70">June {item + 1}, 2023</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="videos" className="mt-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {[3, 6].map((item) => (
                  <div key={item} className="relative group overflow-hidden rounded-lg">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      width={300}
                      height={200}
                      alt={`Video ${item}`}
                      className="object-cover w-full aspect-video"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between p-3 transition-opacity bg-black/60 opacity-0 group-hover:opacity-100">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-white">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500 hover:bg-blue-600">
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </Badge>
                        </div>
                        <h3 className="mt-1 text-sm font-medium">Match Highlights</h3>
                        <p className="text-xs text-white/70">June {item + 1}, 2023</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
